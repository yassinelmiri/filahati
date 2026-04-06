'use client';

import { useState } from 'react';
import { useApp } from '@/lib/store';
import { Feed } from '@/lib/feed-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Pencil, Trash2, Filter } from 'lucide-react';

export function FeedsView() {
  const { t, feeds, addFeed, updateFeed, deleteFeed, user, language } = useApp();
  const isAdmin = user?.role === 'admin';

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState<Feed | null>(null);
  const [formData, setFormData] = useState<Partial<Feed>>({
    name: '',
    nameFr: '',
    nameAr: '',
    category: 'forage',
    ms: 0,
    ufl: 0,
    pdin: 0,
    pdie: 0,
    uel: 0,
    ca: 0,
    p: 0
  });

  const filteredFeeds = feeds.filter(feed => {
    const matchesSearch = 
      feed.nameFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feed.nameAr.includes(searchQuery) ||
      feed.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || feed.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenDialog = (feed?: Feed) => {
    if (feed) {
      setSelectedFeed(feed);
      setFormData({ ...feed });
    } else {
      setSelectedFeed(null);
      setFormData({
        name: '',
        nameFr: '',
        nameAr: '',
        category: 'forage',
        ms: 0,
        ufl: 0,
        pdin: 0,
        pdie: 0,
        uel: 0,
        ca: 0,
        p: 0
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (selectedFeed) {
      updateFeed(selectedFeed.id, formData);
    } else {
      addFeed(formData as Omit<Feed, 'id'>);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (selectedFeed) {
      deleteFeed(selectedFeed.id);
    }
    setIsDeleteDialogOpen(false);
    setSelectedFeed(null);
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      forage: 'bg-chart-1/10 text-chart-1 border-chart-1/20',
      concentrate: 'bg-chart-2/10 text-chart-2 border-chart-2/20',
      mineral: 'bg-chart-3/10 text-chart-3 border-chart-3/20'
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  const getFeedName = (feed: Feed) => {
    return language === 'ar' ? feed.nameAr : feed.nameFr;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('feeds')}</h1>
          <p className="text-muted-foreground">
            {language === 'fr'
              ? 'Base de données des aliments FILAHATI'
              : 'قاعدة بيانات الأعلاف FILAHATI'}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            {t('addFeed')}
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {language === 'fr' ? 'Toutes catégories' : 'جميع الفئات'}
                </SelectItem>
                <SelectItem value="forage">{t('forage')}</SelectItem>
                <SelectItem value="concentrate">{t('concentrate')}</SelectItem>
                <SelectItem value="mineral">{t('mineral')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Feeds table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>
            {language === 'fr' ? 'Liste des aliments' : 'قائمة الأعلاف'} ({filteredFeeds.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('feedName')}</TableHead>
                  <TableHead>{t('feedCategory')}</TableHead>
                  <TableHead className="text-center">{t('dryMatter')}</TableHead>
                  <TableHead className="text-center">{t('ufl')}</TableHead>
                  <TableHead className="text-center">{t('pdin')}</TableHead>
                  <TableHead className="text-center">{t('pdie')}</TableHead>
                  <TableHead className="text-center">{t('uel')}</TableHead>
                  <TableHead className="text-center">Ca</TableHead>
                  <TableHead className="text-center">P</TableHead>
                  {isAdmin && <TableHead className="text-center">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeeds.map((feed) => (
                  <TableRow key={feed.id}>
                    <TableCell className="font-medium">{getFeedName(feed)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getCategoryBadge(feed.category)}>
                        {t(feed.category as any)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{feed.ms}</TableCell>
                    <TableCell className="text-center">{feed.ufl.toFixed(2)}</TableCell>
                    <TableCell className="text-center">{feed.pdin}</TableCell>
                    <TableCell className="text-center">{feed.pdie}</TableCell>
                    <TableCell className="text-center">{feed.uel.toFixed(2)}</TableCell>
                    <TableCell className="text-center">{feed.ca}</TableCell>
                    <TableCell className="text-center">{feed.p}</TableCell>
                    {isAdmin && (
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(feed)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedFeed(feed);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedFeed ? t('editFeed') : t('addFeed')}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>{language === 'fr' ? 'Nom (FR)' : 'الاسم (فرنسي)'}</FieldLabel>
                <Input
                  value={formData.nameFr || ''}
                  onChange={(e) => setFormData({ ...formData, nameFr: e.target.value })}
                />
              </Field>
              <Field>
                <FieldLabel>{language === 'fr' ? 'Nom (AR)' : 'الاسم (عربي)'}</FieldLabel>
                <Input
                  value={formData.nameAr || ''}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  dir="rtl"
                />
              </Field>
            </div>

            <Field>
              <FieldLabel>{t('feedCategory')}</FieldLabel>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as Feed['category'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="forage">{t('forage')}</SelectItem>
                  <SelectItem value="concentrate">{t('concentrate')}</SelectItem>
                  <SelectItem value="mineral">{t('mineral')}</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Field>
                <FieldLabel>{t('dryMatter')}</FieldLabel>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.ms || ''}
                  onChange={(e) => setFormData({ ...formData, ms: parseFloat(e.target.value) || 0 })}
                />
              </Field>
              <Field>
                <FieldLabel>{t('ufl')}</FieldLabel>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.ufl || ''}
                  onChange={(e) => setFormData({ ...formData, ufl: parseFloat(e.target.value) || 0 })}
                />
              </Field>
              <Field>
                <FieldLabel>{t('pdin')}</FieldLabel>
                <Input
                  type="number"
                  value={formData.pdin || ''}
                  onChange={(e) => setFormData({ ...formData, pdin: parseFloat(e.target.value) || 0 })}
                />
              </Field>
              <Field>
                <FieldLabel>{t('pdie')}</FieldLabel>
                <Input
                  type="number"
                  value={formData.pdie || ''}
                  onChange={(e) => setFormData({ ...formData, pdie: parseFloat(e.target.value) || 0 })}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Field>
                <FieldLabel>{t('uel')}</FieldLabel>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.uel || ''}
                  onChange={(e) => setFormData({ ...formData, uel: parseFloat(e.target.value) || 0 })}
                />
              </Field>
              <Field>
                <FieldLabel>Ca (g/kg MS)</FieldLabel>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.ca || ''}
                  onChange={(e) => setFormData({ ...formData, ca: parseFloat(e.target.value) || 0 })}
                />
              </Field>
              <Field>
                <FieldLabel>P (g/kg MS)</FieldLabel>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.p || ''}
                  onChange={(e) => setFormData({ ...formData, p: parseFloat(e.target.value) || 0 })}
                />
              </Field>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSave}>
              {t('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteConfirmMessage')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
